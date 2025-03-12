import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";
import { User } from "./user-model";

// Address attributes interface
interface AddressAttributes {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressCreationAttribute extends Optional<AddressAttributes, "id"> {}

// Address model definition
class Address
  extends Model<AddressAttributes, AddressCreationAttribute>
  implements AddressAttributes
{
  public id!: string;
  public userId!: string;
  public street!: string;
  public city!: string;
  public state!: string;
  public postalCode!: string;
  public country!: string;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: true,
  },
);

// Establish relationship with User
User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

Address.sync({ force: false, alter: true })
  .then(() => console.log("Address table synced"))
  .catch(console.error);

export { Address };
