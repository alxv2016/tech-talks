export interface SiteContent {
  data: Content[];
  public: boolean;
}

export interface Content {
  id?: number;
  created_on?: string;
  hero: Hero;
  value_props: Valueprop[];
  intro: Intro;
  features: Feature[];
  session: Intro;
  sign_up: Intro;
  form: Form;
  form_skill: Formskill[];
  hosts: Hosts;
  faqs: Hosts;
  faq_panels: Faqpanel[];
  host: Host[];
  sign_up_success: Intro;
  sign_up_closed: Intro;
}

interface Host {
  newItem?: boolean;
  name: string;
  role: string;
  image: string;
}

interface Faqpanel {
  newItem?: boolean;
  title: string;
  body: string;
}

interface Hosts {
  title: string;
}

interface Formskill {
  newItem?: boolean;
  label: string;
  value: string;
}

interface Form {
  first_name: string;
  last_name: string;
  skill_level: string;
  comments: string;
  helper: string;
  action: string;
}

interface Feature {
  newItem?: boolean;
  title: string;
  descr: string;
}

interface Intro {
  overline: string;
  title: string;
  body: string;
  video?: string;
}

interface Valueprop {
  newItem?: boolean;
  value_prop: string;
}

interface Hero {
  title: string;
  body: string;
}
