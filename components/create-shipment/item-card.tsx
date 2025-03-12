import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";

interface ItemCardProps {
  item: number; // e.g., "Item 1"
  description: string;
  dimension: number;
  quantity: number;
  handleRemove: () => void;
}

export function ItemCard({
  item,
  description,
  dimension,
  quantity,
  handleRemove,
}: ItemCardProps) {
  return (
    <Card className="rounded-sm p-4 shadow">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-bold">Package: {item}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 py-2">
        <p className="text-muted-foreground mb-2 text-sm">{description}</p>
        <div className="flex items-center justify-between gap-2 ">
          <div className="border-r-2 pr-2">
            <Label className="block text-xs font-medium text-gray-600">
              Dimension:
            </Label>
            <p className="text-sm">{dimension} cm</p>
          </div>
          <div>
            <Label className="block text-xs font-medium text-gray-600">
              Quantity:
            </Label>
            <p className="text-sm">{quantity}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button variant={"destructive"} size={"sm"} onClick={handleRemove}>
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
