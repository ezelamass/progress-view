import { useState, useEffect } from 'react';
import { Search, FileText, Users, FolderOpen, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'client' | 'deliverable' | 'payment';
  url: string;
}

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch = ({ className }: GlobalSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  const searchData = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const results: SearchResult[] = [];

      // Search projects
      const { data: projects } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          clients:client_id (
            company
          )
        `)
        .ilike('name', `%${searchQuery}%`);

      if (projects) {
        projects.forEach(project => {
          results.push({
            id: project.id,
            title: project.name,
            description: `Project • ${project.clients?.company || 'Unknown Client'}`,
            type: 'project',
            url: `/admin/projects`
          });
        });
      }

      // Search clients (admin only)
      if (profile?.role === 'admin') {
        const { data: clients } = await supabase
          .from('clients')
          .select('id, company, name')
          .or(`company.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`);

        if (clients) {
          clients.forEach(client => {
            results.push({
              id: client.id,
              title: client.company,
              description: `Client • ${client.name}`,
              type: 'client',
              url: `/admin/clients`
            });
          });
        }
      }

      // Search deliverables
      const { data: deliverables } = await supabase
        .from('deliverables')
        .select(`
          id,
          name,
          description,
          projects:project_id (
            name
          )
        `)
        .ilike('name', `%${searchQuery}%`);

      if (deliverables) {
        deliverables.forEach(deliverable => {
          results.push({
            id: deliverable.id,
            title: deliverable.name,
            description: `Deliverable • ${deliverable.projects?.name || 'Unknown Project'}`,
            type: 'deliverable',
            url: '/deliverables'
          });
        });
      }

      // Search payments
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          id,
          description,
          amount,
          projects:project_id (
            name
          )
        `)
        .ilike('description', `%${searchQuery}%`);

      if (payments) {
        payments.forEach(payment => {
          results.push({
            id: payment.id,
            title: payment.description || 'Payment',
            description: `Payment • $${payment.amount} • ${payment.projects?.name || 'Unknown Project'}`,
            type: 'payment',
            url: '/payments'
          });
        });
      }

      setResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        searchData(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderOpen className="h-4 w-4" />;
      case 'client':
        return <Users className="h-4 w-4" />;
      case 'deliverable':
        return <FileText className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'client':
        return 'bg-success/20 text-success border-success/30';
      case 'deliverable':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'payment':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setOpen(false);
    setQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`w-64 justify-start text-muted-foreground ${className}`}>
          <Search className="h-4 w-4 mr-2" />
          Search projects, clients...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search everything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
              autoFocus
            />
          </div>
        </div>
        
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found</p>
            </div>
          ) : query.length < 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Type at least 2 characters to search</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result) => (
                <div 
                  key={`${result.type}-${result.id}`}
                  className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground">
                          {result.title}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTypeColor(result.type)}`}
                        >
                          {result.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default GlobalSearch;