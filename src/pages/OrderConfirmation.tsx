import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";
import { Order } from "@/types/firestore";
import { getOrder } from "@/services/firebaseService";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams<{ orderId: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!orderId) {
      navigate("/marketplace");
      return;
    }
    loadOrder();
  }, [currentUser, orderId, navigate]);

  const loadOrder = async () => {
    if (!orderId) return;
    
    try {
      const orderData = await getOrder(orderId);
      if (!orderData) {
        toast({
          title: "Order Not Found",
          description: "The order could not be found",
          variant: "destructive",
        });
        navigate("/marketplace");
        return;
      }
      setOrder(orderData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
      navigate("/marketplace");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
              <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </CardHeader>
          <CardContent>
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold">Order Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  {item.product.imageURL ? (
                    <img
                      src={item.product.imageURL}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-muted-foreground">
                  We're preparing your eco-friendly products for shipment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Shipping Notification</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email with tracking information once your order ships.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Your sustainable products will arrive within 3-5 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/marketplace">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/profile">
            <Button className="w-full sm:w-auto">
              View Order History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}