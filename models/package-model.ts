import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";
import { Shipment } from "./shipment-model";

// Package attributes interface
interface PackageAttributes {
  id: string;
  shipmentId: string;
  weight: number;
  dimensions: string;
  description: string;
}

interface PackageCreationAttribute extends Optional<PackageAttributes, "id"> {}
// Package model definition
class Package
  extends Model<PackageAttributes, PackageCreationAttribute>
  implements PackageAttributes
{
  public id!: string;
  public shipmentId!: string;
  public weight!: number;
  public dimensions!: string;
  public description!: string;
}

Package.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shipmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Shipment,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "packages",
    timestamps: true,
  },
);

// Establish relationship with Shipment
Shipment.hasMany(Package, { foreignKey: "shipmentId" });
Package.belongsTo(Shipment, { foreignKey: "shipmentId" });

Package.sync({ force: false, alter: true })
  .then(() => console.log("Package table synced"))
  .catch(console.error);

export { Package };
