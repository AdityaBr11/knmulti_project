import { IRole } from "../db/schema/role";

const validateRole = (role: IRole) => {
  if (!role) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!role.name) errors.push({ message: "Role name is required" });
  // if (!role.description)
  //   errors.push({ message: "Role description is required" });
  // if (!role.department) errors.push({ message: "Role department is required" });
  // if (!role.authorities)
  //   errors.push({ message: "Role authorities is required" });
  // if (!role.authorities.length)
  //   errors.push({ message: "Role authorities is required" });
  return errors;
};

export default validateRole;
