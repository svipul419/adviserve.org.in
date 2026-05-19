export interface Campaign {
  id: string;
  name: string;
  template_id: string | null;
  list_id: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

export interface EmailList {
  id: string;
  name: string;
  subscriber_count: number;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface EmailCampaignFormData {
  name: string;
  template_id: string;
  list_id: string;
}
