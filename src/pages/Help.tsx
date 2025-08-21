import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Help = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you with your project today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const mockAIResponses = [
    "I'd be happy to help you with that! Let me look into your project details.",
    "Based on your current project status, here are some suggestions...",
    "That's a great question! For your TechStart Solutions project, I recommend...",
    "I can help you understand your ROI metrics better. Would you like me to explain the calculations?",
    "Your project is currently in Week 3: Implementation phase. Is there something specific you'd like to know?",
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Mock AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground mt-2">
            Get instant support from our AI assistant
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
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Project Status</h3>
              <p className="text-sm text-muted-foreground">
                Get updates on your current project progress
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">ROI Explanation</h3>
              <p className="text-sm text-muted-foreground">
                Understand how your ROI is calculated
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Payment Support</h3>
              <p className="text-sm text-muted-foreground">
                Questions about billing and payments
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Help;