
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: Record<string, boolean>;
  handleFilterChange: (field: string) => void;
}

export const MobileFilter = ({
  isOpen,
  onClose,
  filterOptions,
  handleFilterChange
}: MobileFilterProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Messages</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-sm font-medium mb-2">Show</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterOptions.showUserMessages} 
                  onChange={() => handleFilterChange('showUserMessages')}
                  className="rounded"
                />
                <span className="text-sm">User Messages</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterOptions.showBotMessages} 
                  onChange={() => handleFilterChange('showBotMessages')}
                  className="rounded"
                />
                <span className="text-sm">Bot Responses</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterOptions.showFeedback} 
                  onChange={() => handleFilterChange('showFeedback')}
                  className="rounded"
                />
                <span className="text-sm">Feedback Messages</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Only Show</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterOptions.onlyVoiceMessages} 
                  onChange={() => handleFilterChange('onlyVoiceMessages')}
                  className="rounded"
                />
                <span className="text-sm">Voice Messages</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterOptions.onlyUnread} 
                  onChange={() => handleFilterChange('onlyUnread')}
                  className="rounded"
                />
                <span className="text-sm">Unread</span>
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
