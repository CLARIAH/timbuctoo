package nl.knaw.huygens.timbuctoo.model.dcar;

/*
 * #%L
 * Timbuctoo model
 * =======
 * Copyright (C) 2012 - 2015 Huygens ING
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

import org.apache.commons.lang.StringUtils;

/**
 * A helper class, that helps to build a period.
 * The format is specific for the Dutch Caribbean project.
 */
class PeriodHelper {

  /**
   * @param beginDate should be a year
   * @param endDate should be a year
   */
  public static String createPeriod(String beginDate, String endDate) {
    beginDate = StringUtils.isBlank(beginDate) ? endDate : beginDate;
    endDate = StringUtils.isBlank(endDate) ? beginDate : endDate;

    if (StringUtils.isNotBlank(beginDate) && StringUtils.isNotBlank(endDate)) {
      return String.format("%s - %s", beginDate, endDate);
    }

    return null;
  }

}
