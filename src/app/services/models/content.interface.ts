export interface PrismicQuery {
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page?: any;
  prev_page?: any;
  results: Result[];
  version: string;
  license: string;
}

interface Result {
  id: string;
  uid: string;
  url?: any;
  type: string;
  href: string;
  tags: string[];
  first_publication_date: string;
  last_publication_date: string;
  slugs: string[];
  linked_documents: any[];
  lang: string;
  alternate_languages: any[];
  data: TechTalksCollection;
}

export interface TechTalksCollection {
  page_title: string;
  hero_title: string;
  hero_content: string;
  value_props: Valueprop[];
  intro_callout: string;
  intro_title: string;
  intro_content: string;
  topics: Topic[];
  session_callout: string;
  session_title: string;
  session_content: string;
  session_topics: Sessiontopic[];
  host_title: string;
  hosts: Host[];
  faq_title: string;
  faqs: Faq[];
  slogan: string;
}

interface Faq {
  faq: string;
  faq_content: string;
}

interface Host {
  host_image: Sessionimage;
  host_initials: string;
  host_name: string;
  host_content: string;
  has_image: boolean;
}

interface Sessiontopic {
  session_image: Sessionimage;
  session_topic?: any;
  session_topic_content?: any;
  has_image?: boolean;
}

interface Sessionimage {}

interface Topic {
  topic: string;
  topic_content: string;
}

interface Valueprop {
  value_prop: string;
}
