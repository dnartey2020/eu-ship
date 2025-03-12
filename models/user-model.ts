import { Model, DataType, DataTypes, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";

enum Roles {
  CUSTOMER,
  ADMIN,
  MANAGER,
}

interface UserAttribute {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phonenumber: string;
}
interface UserCreationAttribute extends Optional<UserAttribute, "id"> {}

class User
  extends Model<UserAttribute, UserCreationAttribute>
  implements UserAttribute
{
  public id!: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public phonenumber: string;
  public password: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  },
);

User.sync({ alter: true })
  .then(() => console.log("User table synced"))
  .catch(console.error);

export { User, Roles };
