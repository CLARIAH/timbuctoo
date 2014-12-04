package nl.knaw.huygens.timbuctoo.model;

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

import java.util.List;

import nl.knaw.huygens.timbuctoo.annotations.IDPrefix;

import com.google.common.base.Objects;
import com.google.common.collect.Lists;

@IDPrefix(VREAuthorization.ID_PREFIX)
public class VREAuthorization extends SystemEntity {

	public static final String ID_PREFIX = "VREA";
	private String vreId;
	private String userId;
	private List<String> roles;

	public VREAuthorization() {
	}

	public VREAuthorization(String vreId, String userId, String... roles) {
		setVreId(vreId);
		setUserId(userId);
		if (roles != null) {
			setRoles(Lists.newArrayList(roles));
		}
	}

	@Override
	public String getIdentificationName() {
		return null;
	}

	public String getVreId() {
		return vreId;
	}

	public void setVreId(String vreId) {
		this.vreId = vreId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof VREAuthorization)) {
			return false;
		}

		VREAuthorization other = (VREAuthorization) obj;

		return Objects.equal(other.vreId, vreId) && Objects.equal(other.userId, userId);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(vreId, userId);
	}

}
