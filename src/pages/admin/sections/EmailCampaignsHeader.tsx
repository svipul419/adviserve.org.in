import { Plus } from 'lucide-react';

interface EmailCampaignsHeaderProps {
  onCreateCampaign: () => void;
}

export function EmailCampaignsHeader({ onCreateCampaign }: EmailCampaignsHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
      <button
        onClick={onCreateCampaign}
        className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
      >
        <Plus size={20} />
        Create Campaign
      </button>
    </div>
  );
}
