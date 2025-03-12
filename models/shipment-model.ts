import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";
import { User } from "./user-model";

enum ShipmentStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

enum ServiceType {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  INTERNATIONAL = "INTERNATIONAL",
}

interface ShipmentAttributes {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  userId: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderPostalCode: string;
  senderCountry: string;
  senderPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverPostalCode: string;
  receiverCountry: string;
  receiverPhone: string;
  serviceType: ServiceType;
  specialInstructions?: string;
}

interface ShipmentCreationAttribute
  extends Optional<ShipmentAttributes, "id" | "specialInstructions"> {}

class Shipment
  extends Model<ShipmentAttributes, ShipmentCreationAttribute>
  implements ShipmentAttributes
{
  public id!: string;
  public trackingNumber!: string;
  public status!: ShipmentStatus;
  public userId!: string;
  public senderName!: string;
  public senderAddress!: string;
  public senderCity!: string;
  public senderPostalCode!: string;
  public senderCountry!: string;
  public senderPhone!: string;
  public receiverName!: string;
  public receiverAddress!: string;
  public receiverCity!: string;
  public receiverPostalCode!: string;
  public receiverCountry!: string;
  public receiverPhone!: string;
  public serviceType!: ServiceType;
  public specialInstructions?: string;
}

Shipment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ShipmentStatus)),
      allowNull: false,
      defaultValue: ShipmentStatus.PENDING,
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
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderPostalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverPostalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM("STANDARD", "EXPRESS", "INTERNATIONAL"),
      allowNull: false,
      defaultValue: ServiceType.STANDARD,
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "shipments",
    timestamps: true,
    underscored: true,
  },
);

User.hasMany(Shipment, { foreignKey: "userId" });
Shipment.belongsTo(User, { foreignKey: "userId" });

Shipment.sync({ force: false, alter: true })
  .then(() => console.log("Shipment table synced"))
  .catch(console.error);

export { Shipment, ShipmentStatus, ServiceType };
