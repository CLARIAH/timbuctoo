package nl.knaw.huygens.timbuctoo.vre;

/*
 * #%L
 * Timbuctoo core
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

import java.io.IOException;

public class CKCCVRE extends AbstractVRE {

  public static final String NAME = "CKCC";

  @Override
  protected Scope createScope() throws IOException {
    return new PackageScope("timbuctoo.model.ckcc");
  }

  @Override
  public String getScopeId() {
    return "ckcc";
  }

  @Override
  public String getVreId() {
    return NAME;
  }

  @Override
  public String getDescription() {
    return "VRE for the 'CKCC' project.";
  }

  @Override
  public String getDomainEntityPrefix() {
    return "ckcc";
  }

}
