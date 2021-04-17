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
  initials?: string;
}

interface Faqpanel {
  newItem?: boolean;
  title: string;
  body: string;
}

interface Hosts {
  title: string;
  tagline?: string;
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
  auto_layout_overline?: string;
  auto_layout_title?: string;
  auto_layout_intro?: string;
  variant_overline?: string;
  variant_title?: string;
  variant_intro?: string;
  prototype_overline?: string;
  prototype_title?: string;
  prototype_intro?: string;
}

interface Valueprop {
  newItem?: boolean;
  value_prop: string;
}

interface Hero {
  title: string;
  body: string;
}
