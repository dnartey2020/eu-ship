import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";
import { Shipment } from "./shipment-model";
import { User } from "./user-model";

// Define an enum for invoice status
enum InvoiceStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

// Interface for the Invoice attributes
interface InvoiceAttributes {
  id: string;
  invoiceNumber: string;
  amount: number;
  taxRate: number;
  dueDate: Date;
  status: InvoiceStatus;
  shipmentId: string;
  userId: string;
}

interface InvoiceCreationAttribute extends Optional<InvoiceAttributes, "id"> {}

// Define the Invoice model
class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttribute>
  implements InvoiceAttributes
{
  public id!: string;
  public invoiceNumber: string;
  public shipmentId: string;
  public userId: string;
  public amount: number;
  public taxRate: number;
  public dueDate: Date;
  public status: InvoiceStatus;

  // Timestamps managed by Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.01 },
    },
    taxRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 1 },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(InvoiceStatus)),
      defaultValue: InvoiceStatus.UNPAID,
    },
    shipmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Shipment, key: "id" },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Invoice",
    timestamps: true,
  },
);

// Associations
Shipment.hasOne(Invoice, { foreignKey: "shipmentId" });
Invoice.belongsTo(Shipment, { foreignKey: "shipmentId" });

User.hasMany(Invoice, { foreignKey: "userId" });
Invoice.belongsTo(User, { foreignKey: "userId" });

Invoice.sync({ alter: true })
  .then(() => console.log("Invoice table synced"))
  .catch(console.error);

export { Invoice, InvoiceStatus };
