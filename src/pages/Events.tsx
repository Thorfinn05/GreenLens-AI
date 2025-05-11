
import React from "react";
import { useCommunity } from "@/contexts/CommunityContext";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Events() {
  const { events, loading, attendEvent, leaveEvent } = useCommunity();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
          <p className="mb-6 text-muted-foreground">
            Sign in to view and participate in environmental events.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Group events by upcoming and past
  const now = Date.now();
  const upcomingEvents = events.filter(event => event.date > now);
  const pastEvents = events.filter(event => event.date <= now);

  const handleAttendEvent = async (eventId: string) => {
    await attendEvent(eventId);
  };

  const handleLeaveEvent = async (eventId: string) => {
    await leaveEvent(eventId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Environmental Events</h1>
        <Button onClick={() => navigate("/events/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {loading.events ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    {event.imageURL && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={event.imageURL}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(event.date, "PPP, p")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location.address}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="line-clamp-3">{event.description}</p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                      </div>
                      
                      {event.attendees.includes(currentUser.uid) ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleLeaveEvent(event.id)}
                        >
                          Cancel RSVP
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleAttendEvent(event.id)}
                        >
                          RSVP
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No upcoming events.</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Past Events</h2>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden opacity-70">
                    {event.imageURL && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={event.imageURL}
                          alt={event.title}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(event.date, "PPP, p")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location.address}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="line-clamp-3">{event.description}</p>
                    </CardContent>
                    
                    <CardFooter>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.attendees.length} attended
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No past events.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">No events yet.</p>
          <Button onClick={() => navigate("/events/new")}>
            Create First Event
          </Button>
        </div>
      )}
    </div>
  );
}