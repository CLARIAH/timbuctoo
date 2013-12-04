package nl.knaw.huygens.timbuctoo.config;

import static com.google.common.base.Preconditions.checkArgument;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

import nl.knaw.huygens.timbuctoo.model.DomainEntity;
import nl.knaw.huygens.timbuctoo.model.Entity;
import nl.knaw.huygens.timbuctoo.model.Relation;
import nl.knaw.huygens.timbuctoo.model.Role;
import nl.knaw.huygens.timbuctoo.model.SystemEntity;
import nl.knaw.huygens.timbuctoo.model.Variable;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.ImmutableSortedSet;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.common.reflect.ClassPath;
import com.google.common.reflect.ClassPath.ClassInfo;
import com.google.inject.Singleton;

/**
 * The type registry contains properties of entity classes.
 *
 * We distinguish two types of entities:<ul>
 * <li>System entities are for internal use in the repository;
 * they are not versioned and do not have variations.</li>
 * <li>Domain entities are used for modeling user entities;
 * they are versioned and may have variations.</li>
 * </ul>
 *
 * <p>The type registry scans specified Java packages for concrete
 * (i.e. not abstract) classes that subclass {@code Entity}.
 *
 * <p>The use of classes as type tokens is connected to type erasure
 * of Java generics. In addition to type tokens we use two string
 * representations of entity types:
 * - internal names, which are used, for instance, for indicating
 * entity types in JSON (so as to hide implementation details),
 * for Solr core names, and for Mongo collection names.
 * - external names, which are used in the REST API for indicating
 * entity collections.
 * Internal names are simply detailed a rule: the lower case form
 * of the simple class name (the last part of the fully qualified
 * class name). External names are determined as the plural of the
 * internal name (constructed by appending an 's' to the internal
 * name) or a name supplied in a class annotation.</p>
 */
@Singleton
public class TypeRegistry {

  private final Logger LOG = LoggerFactory.getLogger(TypeRegistry.class);

  private final Map<Class<? extends Entity>, String> type2iname = Maps.newHashMap();
  private final Map<String, Class<? extends Entity>> iname2type = Maps.newHashMap();

  private final Map<String, Set<Class<? extends Variable>>> variationMap = Maps.newHashMap();

  private final Map<Class<? extends Entity>, String> type2xname = Maps.newHashMap();
  private final Map<String, Class<? extends Entity>> xname2type = Maps.newHashMap();

  private final Map<String, String> iname2xname = Maps.newHashMap();

  private final Map<String, Class<? extends Role>> iname2role = Maps.newHashMap();
  private final Map<Class<? extends Role>, String> role2iname = Maps.newHashMap();

  private final Map<Class<? extends Entity>, Set<Class<? extends Role>>> allowedRoles = Maps.newHashMap();

  public TypeRegistry(String packageNames) {
    checkArgument(packageNames != null, "'packageNames' must not be null");

    ClassPath classPath = getClassPath();
    for (String packageName : StringUtils.split(packageNames)) {
      registerPackage(classPath, packageName.replaceFirst("^timbuctoo", "nl.knaw.huygens.timbuctoo"));
    }
  }

  private ClassPath getClassPath() {
    try {
      return ClassPath.from(this.getClass().getClassLoader());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private void registerPackage(ClassPath classPath, String packageName) {
    Set<Class<? extends Role>> roles = Sets.newHashSet();
    for (ClassInfo info : classPath.getTopLevelClasses(packageName)) {
      Class<?> type = info.load();
      if (isEntity(type) && !shouldNotRegister(type)) {
        if (BusinessRules.isValidSystemEntity(type)) {
          registerEntity(toSystemEntity(type));
        } else if (BusinessRules.isValidDomainEntity(type)) {
          Class<? extends DomainEntity> entityType = toDomainEntity(type);
          registerEntity(entityType);
          registerVariationForClass(entityType);
          if (!Relation.class.isAssignableFrom(entityType)) {
            allowedRoles.put(entityType, roles);
          }
        } else {
          LOG.error("Not a valid entity: '{}'", type.getName());
          throw new IllegalStateException("Invalid entity");
        }
        LOG.debug("Registered entity {}", type.getName());
      } else if (isRole(type) && !shouldNotRegister(type)) {
        if (BusinessRules.isValidRole(type)) {
          Class<? extends Role> roleType = toRole(type);
          registerRole(roleType);
          registerVariationForClass(roleType);
          roles.add(roleType);
        } else {
          LOG.error("Not a valid role: '{}'", type.getName());
          throw new IllegalStateException("Invalid role");
        }
      }
    }
  }

  private boolean shouldNotRegister(Class<?> type) {
    return Modifier.isAbstract(type.getModifiers());
  }

  // -------------------------------------------------------------------

  private <T extends Entity> void registerEntity(Class<T> type) {
    String iname = TypeNames.getInternalName(type);
    if (iname2type.containsKey(iname)) {
      throw new IllegalStateException("Duplicate internal type name " + iname);
    }
    iname2type.put(iname, type);
    type2iname.put(type, iname);

    String xname = TypeNames.getExternalName(type);
    if (xname2type.containsKey(xname)) {
      throw new IllegalStateException("Duplicate internal type name " + xname);
    }
    xname2type.put(xname, type);
    type2xname.put(type, xname);

    iname2xname.put(iname, xname);
  }

  private <T extends Role> void registerRole(Class<T> role) {
    String iname = TypeNames.getInternalName(role);
    if (iname2role.containsKey(iname)) {
      throw new IllegalStateException("Duplicate internal type name " + iname);
    }
    iname2role.put(iname, role);
    role2iname.put(role, iname);
  }

  private void registerVariationForClass(Class<? extends Variable> type) {
    String variation = getClassVariation(type);

    if (variation != null) {
      if (variationMap.containsKey(variation)) {
        variationMap.get(variation).add(type);
      } else {
        Set<Class<? extends Variable>> set = Sets.newHashSet();
        set.add(type);
        variationMap.put(variation, set);
      }
    }
  }

  // --- public api ----------------------------------------------------

  /**
   * Returns the internal type names.
   */
  public Set<String> getTypeStrings() {
    return ImmutableSortedSet.copyOf(iname2type.keySet());
  }

  /**
   * Returns the internal type name for the specified type token,
   * or {@code null} if there is no such name.
   */
  public String getINameForType(Class<? extends Entity> type) {
    return type2iname.get(type);
  }

  /**
   * Returns the internal type name for the specified role type token,
   * or {@code null} if there is no such name.
   */
  public String getINameForRole(Class<? extends Role> role) {
    return role2iname.get(role);
  }

  /**
   * Convenience method that returns {@code getINameForType} or {@code getINameForRole} or null depending on the parameter. 
   * @param type the type to get the internal name from. 
   * @return
   */
  @SuppressWarnings("unchecked")
  public String getIName(Class<?> type) {
    if (isEntity(type)) {
      return getINameForType((Class<? extends Entity>) type);
    } else if (isRole(type)) {
      return getINameForRole(toRole(type));
    }
    return null;
  }

  /**
   * Returns the type token for the specified internal type name,
   * or {@code null} if there is no such token.
   */
  public Class<? extends Entity> getTypeForIName(String iName) {
    return iname2type.get(iName);
  }

  /**
   * Returns the role type token for the specified internal name
   * or {@code null} if there is no such token.
   * @param iName the internal name that is requested.
   * @return
   */
  public Class<? extends Role> getRoleForIName(String iName) {
    return iname2role.get(iName);
  }

  /**
   * Returns a {@code Role} class or a {@code Entity} class if one is found.
   * @param iName the internal name to get the class from.
   * @return the class if one is found.
   */
  public Class<?> getForIName(String iName) {
    if (iname2role.containsKey(iName)) {
      return iname2role.get(iName);
    }

    return iname2type.get(iName);
  }

  /**
   * Returns the external type name for the specified type token,
   * or {@code null} if there is no such name.
   */
  public String getXNameForType(Class<? extends Entity> type) {
    return type2xname.get(type);
  }

  /**
   * Returns the type token for the specified external type name,
   * or {@code null} if there is no such token.
   */
  public Class<? extends Entity> getTypeForXName(String xName) {
    return xname2type.get(xName);
  }

  /**
   * Returns the external type name for the specified internal type name,
   * or {@code null} if there is no such name.
   */
  public String getXNameForIName(String iname) {
    return iname2xname.get(iname);
  }

  @SuppressWarnings("unchecked")
  public Class<? extends Entity> getBaseClass(Class<? extends Entity> type) {
    Class<? extends Entity> lastType = type;
    while (type != null && !Modifier.isAbstract(type.getModifiers())) {
      lastType = type;
      type = (Class<? extends Entity>) type.getSuperclass();
    }
    return lastType;
  }

  /**
   * Gets a sub class of the primitive that correspondents with the {@code variation}.
   * @param typeForVariation should be a class of the model package.
   * @param variation should be a sub-package of the model package. 
   * @return the class if one is found, if not it returns null.
   */
  public Class<? extends Variable> getVariationClass(Class<? extends Variable> typeForVariation, String variation) {
    Class<? extends Variable> result = null;
    if (variation != null && variationMap.containsKey(variation)) {
      for (Class<? extends Variable> variable : variationMap.get(variation)) {
        if (typeForVariation.isAssignableFrom(variable)) {
          if (result != null) {
            LOG.error("Multiple variables in '{}' for type '{}'", variation, typeForVariation.getSimpleName());
            throw new IllegalStateException("cannot resolve variation class");
          }
          result = variable;
        }
      }
    }
    return result;
  }

  /**
   * Determines the variation of a class. This is based on the package the class is placed in.
   * @param type the type the variation should be determined of.
   * @return the variation. This will be null for each primitive (i.e. Person) and supporting classes (like DomainEntity).
   */
  public String getClassVariation(Class<? extends Variable> type) {
    String packageName = type.getPackage().getName();
    if (packageName.endsWith(".model")) {
      return null;
    }

    return packageName.substring(packageName.lastIndexOf('.') + 1);
  }

  /**
   * Returns the types of the roles that may be assigned to an entity.
   */
  public Set<Class<? extends Role>> getAllowedRolesFor(Class<?> type) {
    Set<Class<? extends Role>> roles = allowedRoles.get(type);
    if (roles != null) {
      return roles;
    } else {
      return Collections.emptySet();
    }
  }

  public void displayAllowedRoles() {
    for (Class<?> type : allowedRoles.keySet()) {
      System.out.println("Allowed roles for " + type.getSimpleName());
      for (Class<?> role : allowedRoles.get(type)) {
        System.out.println(".. " + role.getSimpleName());
      }
    }
  }

  public boolean isRole(String typeName) {
    return this.iname2role.containsKey(typeName);
  }

  // --- static utilities ----------------------------------------------

  public static boolean isEntity(Class<?> cls) {
    return cls == null ? false : Entity.class.isAssignableFrom(cls);
  }

  public static boolean isSystemEntity(Class<?> cls) {
    return cls == null ? false : SystemEntity.class.isAssignableFrom(cls);
  }

  public static boolean isDomainEntity(Class<?> cls) {
    return cls == null ? false : DomainEntity.class.isAssignableFrom(cls);
  }

  public static boolean isRole(Class<?> cls) {
    return cls == null ? false : Role.class.isAssignableFrom(cls);
  }

  /**
   * Forces the typecast of the specified class to an entity type token.
   */
  public static <T extends Entity> Class<T> toEntity(Class<?> cls) throws ClassCastException {
    if (isEntity(cls)) {
      @SuppressWarnings("unchecked")
      Class<T> result = (Class<T>) cls;
      return result;
    }
    throw new ClassCastException(cls.getName() + " is not an entity");
  }

  /**
   * Forces the typecast of the specified class to a system entity type token.
   */
  public static <T extends SystemEntity> Class<T> toSystemEntity(Class<?> cls) throws ClassCastException {
    if (isSystemEntity(cls)) {
      @SuppressWarnings("unchecked")
      Class<T> result = (Class<T>) cls;
      return result;
    }
    throw new ClassCastException(cls.getName() + " is not a system entity");
  }

  /**
   * Forces the typecast of the specified class to a domain entity type token.
   */
  public static <T extends DomainEntity> Class<T> toDomainEntity(Class<?> cls) throws ClassCastException {
    if (isDomainEntity(cls)) {
      @SuppressWarnings("unchecked")
      Class<T> result = (Class<T>) cls;
      return result;
    }
    throw new ClassCastException(cls.getName() + " is not a domain entity");
  }

  @SuppressWarnings("unchecked")
  public static <T extends Role> Class<T> toRole(Class<?> type) {
    if (isRole(type)) {
      return (Class<T>) type;
    }
    throw new ClassCastException(type.getName() + " is not a role");
  }

}
