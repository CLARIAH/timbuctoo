package nl.knaw.huygens.timbuctoo.persistence;

/*
 * #%L
 * Timbuctoo REST api
 * =======
 * Copyright (C) 2012 - 2014 Huygens ING
 * =======
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the 
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public 
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import nl.knaw.huygens.persistence.PersistenceException;
import nl.knaw.huygens.persistence.PersistenceManager;
import nl.knaw.huygens.timbuctoo.config.Paths;

import org.junit.Before;
import org.junit.Test;

import test.rest.model.TestSystemEntity;
import test.rest.model.projecta.ProjectADomainEntity;

public class PersistenceWrapperTest {

  private static final String URL_WITH_ENDING_SLASH = "http://test.nl/";
  private static final Class<ProjectADomainEntity> DEFAULT_DOMAIN_TYPE = ProjectADomainEntity.class;
  private static final Class<TestSystemEntity> DEFAULT_SYSTEM_TYPE = TestSystemEntity.class;
  private PersistenceManager persistenceManager;

  @Before
  public void setUp() {
    persistenceManager = mock(PersistenceManager.class);
  }

  private PersistenceWrapper createInstance(String url) {
    return new PersistenceWrapper(url, persistenceManager);
  }

  @Test
  public void testPersistDomainEntitySuccess() throws PersistenceException {
    PersistenceWrapper persistenceWrapper = createInstanceWithoutEndingSlash();
    persistenceWrapper.persistObject(DEFAULT_DOMAIN_TYPE, "1234");
    verifyADomainEntityIsPersisted("/basedomainentities/1234");
  }

  private void verifyADomainEntityIsPersisted(String entityPath) throws PersistenceException {
    verify(persistenceManager).persistURL(URL_WITH_ENDING_SLASH + Paths.DOMAIN_PREFIX + entityPath);
  }

  private PersistenceWrapper createInstanceWithoutEndingSlash() {
    return createInstance("http://test.nl");
  }

  @Test
  public void testPersistSystemEntitySuccess() throws PersistenceException {
    PersistenceWrapper persistenceWrapper = createInstanceWithoutEndingSlash();
    persistenceWrapper.persistObject(DEFAULT_SYSTEM_TYPE, "1234");
    verify(persistenceManager).persistURL(URL_WITH_ENDING_SLASH + Paths.SYSTEM_PREFIX + "/testsystementities/1234");
  }

  @Test
  public void testPersistDomainEntityWithRevision() throws PersistenceException {
    PersistenceWrapper persistenceWrapper = createInstanceWithoutEndingSlash();
    persistenceWrapper.persistObject(DEFAULT_DOMAIN_TYPE, "1234", 12);
    verifyADomainEntityIsPersisted("/basedomainentities/1234?rev=12");
  }

  @Test
  public void testPersistObjectSuccesUrlEndOnSlash() throws PersistenceException {
    PersistenceWrapper persistenceWrapper = createInstance(URL_WITH_ENDING_SLASH);
    persistenceWrapper.persistObject(DEFAULT_DOMAIN_TYPE, "1234");
    verifyADomainEntityIsPersisted("/basedomainentities/1234");
  }

  @Test(expected = PersistenceException.class)
  public void testPersistObjectException() throws PersistenceException {
    when(persistenceManager.persistURL(anyString())).thenThrow(new PersistenceException("error"));
    PersistenceWrapper persistenceWrapper = createInstance(URL_WITH_ENDING_SLASH);
    persistenceWrapper.persistObject(DEFAULT_DOMAIN_TYPE, "1234");
  }

  @Test(expected = IllegalArgumentException.class)
  public void testNewPersistentWrapperBaseUrlIsEmpty() throws PersistenceException {
    new PersistenceWrapper("", persistenceManager);
  }

}
