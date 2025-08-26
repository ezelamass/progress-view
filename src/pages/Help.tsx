import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Help = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte con tu proyecto hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Generate conversation ID
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Call n8n through our edge function
      const { data, error } = await supabase.functions.invoke('n8n-chat', {
        body: {
          conversationId,
          message: messageToSend,
          userId: user?.id,
          userEmail: user?.email,
          userProfile: {
            name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '',
            role: profile?.role
          }
        }
      });

      if (error) {
        console.error('Error calling n8n-chat:', error);
        throw new Error(error.message);
      }

      // Handle multiple responses from n8n
      const responses = data?.responses || [];
      
      if (responses.length === 0) {
        throw new Error('No response received from n8n');
      }

      // Add each response as a separate message with a delay
      for (let i = 0; i < responses.length; i++) {
        setTimeout(() => {
          const aiResponse: Message = {
            id: `${Date.now()}_${i}`,
            content: responses[i]?.content || responses[i] || 'Respuesta recibida',
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiResponse]);
        }, i * 500); // 500ms delay between each response
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente.",
        variant: "destructive",
      });

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Centro de Ayuda</h1>
          <p className="text-muted-foreground mt-2">
            Obtén soporte instantáneo de nuestro asistente de IA
          </p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
            {/* Chat Messages */}
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.sender === "ai" ? (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-secondary/50 text-secondary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70 ${
                        message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Estado del Proyecto</h3>
              <p className="text-sm text-muted-foreground">
                Obtén actualizaciones sobre el progreso de tu proyecto actual
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Explicación del ROI</h3>
              <p className="text-sm text-muted-foreground">
                Entiende cómo se calcula tu ROI
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Soporte de Pagos</h3>
              <p className="text-sm text-muted-foreground">
                Preguntas sobre facturación y pagos
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Help;