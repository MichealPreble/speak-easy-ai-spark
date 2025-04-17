
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from "@/components/ui/alert-dialog";

interface ClearFiltersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClearFilters: () => void;
}

export const ClearFiltersDialog = ({ 
  isOpen, 
  onClose,
  onClearFilters
}: ClearFiltersDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all filters?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all currently active filters. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClearFilters}>
            Clear all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
