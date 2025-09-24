import { useState } from "react";
import { Filter, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";

export interface PaymentFilters {
  status: string;
  paymentType: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface PaymentFiltersProps {
  filters: PaymentFilters;
  onFiltersChange: (filters: PaymentFilters) => void;
  onClearFilters: () => void;
}

const PaymentFilters = ({ filters, onFiltersChange, onClearFilters }: PaymentFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { language } = useTheme();

  const hasActiveFilters = filters.status !== 'all' || filters.paymentType !== 'all' || filters.dateFrom || filters.dateTo;

  const updateFilter = (key: keyof PaymentFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={showFilters} onOpenChange={setShowFilters}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {language === 'es' ? 'Filtrar' : 'Filter'}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {[filters.status !== 'all', filters.paymentType !== 'all', filters.dateFrom, filters.dateTo].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                {language === 'es' ? 'Filtros' : 'Filters'}
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClearFilters}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    {language === 'es' ? 'Limpiar' : 'Clear'}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'es' ? 'Estado' : 'Status'}
                </label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                    <SelectItem value="paid">{language === 'es' ? 'Pagado' : 'Paid'}</SelectItem>
                    <SelectItem value="pending">{language === 'es' ? 'Pendiente' : 'Pending'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'es' ? 'Cancelado' : 'Cancelled'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'es' ? 'Tipo de Pago' : 'Payment Type'}
                </label>
                <Select value={filters.paymentType} onValueChange={(value) => updateFilter('paymentType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                    <SelectItem value="desarrollo">{language === 'es' ? 'Desarrollo' : 'Development'}</SelectItem>
                    <SelectItem value="mantenimiento">{language === 'es' ? 'Mantenimiento' : 'Maintenance'}</SelectItem>
                    <SelectItem value="bonus">{language === 'es' ? 'Bono' : 'Bonus'}</SelectItem>
                    <SelectItem value="commission">{language === 'es' ? 'Comisión' : 'Commission'}</SelectItem>
                    <SelectItem value="reimbursement">{language === 'es' ? 'Reembolso' : 'Reimbursement'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'es' ? 'Rango de Fechas' : 'Date Range'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? format(filters.dateFrom, "dd/MM") : (language === 'es' ? 'Desde' : 'From')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => updateFilter('dateFrom', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, "dd/MM") : (language === 'es' ? 'Hasta' : 'To')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => updateFilter('dateTo', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PaymentFilters;