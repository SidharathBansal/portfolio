// Single source of truth for the site. Every fact here comes from resume.tex.

export const profile = {
  name: "Sidharath Bansal",
  handle: "sidharath",
  role: "Platform Engineer",
  tagline: "Platform Engineer · Open Source Contributor",
  location: "Noida, IN",
  timezone: "Asia/Kolkata",
  email: "sidbansal19@gmail.com",
  // Drop a PDF into /public and set this to "/resume.pdf" to show a Resume button.
  resumeUrl: null as string | null,
  links: {
    linkedin: "https://www.linkedin.com/in/sidharathbansal/",
    github: "https://github.com/sidharathbansal",
  },
  current: {
    title: "SDE - DevOps",
    company: "Physicswallah",
    since: "Sep 2025",
  },
  intro:
    "Kubernetes platforms, API gateways, and the automation, alerting and guardrails around them, with a habit of migrating production without anyone noticing. Lately I've been contributing upstream to NGINX Gateway Fabric.",

  heroStats: [
    { value: "50k RPM", label: "migrated, zero downtime" },
    { value: "99.99%", label: "uptime on Azure" },
    { value: "₹4.7L/mo", label: "cloud spend saved" },
    { value: "2 PRs", label: "merged upstream" },
  ],

  // Career uptime strip: one bar per month from the first month in production.
  career: [
    { company: "Bajaj Finserv Health", from: "2022-07", to: "2025-08" },
    { company: "Physicswallah", from: "2025-09", to: null },
  ],
  uptimeStats: [
    { value: "99.99%", label: "uptime on Azure infrastructure", where: "Bajaj Finserv Health" },
    { value: "200+", label: "containerised apps run on AKS", where: "Bajaj Finserv Health" },
    { value: "100+", label: "production domains on Gateway API", where: "Physicswallah" },
  ],

  work: [
    {
      id: "gateway",
      where: "Physicswallah",
      year: "2025-26",
      title: "Kong to NGINX Gateway Fabric",
      summary:
        "Led the Gateway API migration of production ingress from Kong Gateway to NGINX Gateway Fabric, across 100+ domains carrying 50k requests per minute, with zero downtime.",
      stats: [
        { value: "100+", label: "domains" },
        { value: "50k", label: "RPM" },
        { value: "0", label: "downtime" },
      ],
    },
    {
      id: "eks",
      where: "Physicswallah",
      year: "2025-26",
      title: "EKS 1.32 to 1.34, everywhere",
      summary:
        "Rolled zero-downtime EKS version upgrades through Dev, Staging and Production, one minor version at a time, with no service disruption.",
      stats: [
        { value: "3", label: "environments" },
        { value: "2", label: "minor versions" },
        { value: "0", label: "disruption" },
      ],
    },
    {
      id: "cost",
      where: "Physicswallah",
      year: "2025-26",
      title: "Cutting cloud spend, carefully",
      summary:
        "Built an orphan-resources workbook and decommissioned unused infrastructure, then right-sized AI workloads with Reserved Instances and Commitment Plans.",
      stats: [
        { value: "₹4.7L", label: "saved / month" },
        { value: "30%", label: "off AI workloads" },
      ],
    },
    {
      id: "patch",
      where: "Bajaj Finserv Health",
      year: "2022-25",
      title: "Patching: 2 days to 1 hour",
      summary:
        "Automated server patching across 100+ servers with Ansible inside Azure DevOps pipelines, cutting the patch window from two days to one hour.",
      stats: [
        { value: "100+", label: "servers" },
        { value: "48x", label: "faster" },
      ],
    },
  ],

  alsoShipped: [
    {
      title: "Security scanning in CI/CD",
      body: "Trivy in every pipeline, with automated reports and Jira integration for ownership and remediation.",
      metric: "Trivy + Jira",
      where: "Physicswallah",
    },
    {
      title: "Anomaly alerting",
      body: "CDN traffic and Elastic APM 4xx/5xx anomaly detection for business and technical signals.",
      metric: "-50% escalations",
      where: "Physicswallah",
    },
    {
      title: "Private registries, enforced",
      body: "Moved public images to private ECR across all EKS environments, governed with Kyverno and pull-through cache.",
      metric: "Kyverno + ECR",
      where: "Physicswallah",
    },
    {
      title: "MongoDB, tamed",
      body: "Optimised MongoDB performance and ran zero-downtime MongoDB and Ubuntu upgrades.",
      metric: "~98% to <10% CPU",
      where: "Bajaj Finserv Health",
    },
    {
      title: "Azure Firewall + WAF",
      body: "Rolled out Azure Firewall and WAF with zero downtime, alongside vulnerability scans and patch management.",
      metric: "-60% potential threats",
      where: "Bajaj Finserv Health",
    },
    {
      title: "APIM platform migration",
      body: "Migrated the API Management platform with no service disruption and continued availability.",
      metric: "zero downtime",
      where: "Bajaj Finserv Health",
    },
  ],

  openSource: {
    repo: "nginx/nginx-gateway-fabric",
    repoUrl: "https://github.com/nginx/nginx-gateway-fabric",
    prs: [
      {
        number: 5519,
        title: "feat: add configurable workerProcesses to NginxProxy API",
        url: "https://github.com/nginx/nginx-gateway-fabric/pull/5519",
        merged: "Jun 30, 2026",
        additions: 265,
        deletions: 19,
        problem:
          "NGF hardcoded worker_processes auto, so NGINX started one worker per node CPU core regardless of the container's CPU limit. On big nodes that meant far more workers than intended, and OOMKills.",
        change:
          "A validated workerProcesses field (1-1024) on the NginxProxy API. Unset still renders auto, so the default is preserved.",
        impact: "-90% CPU and memory per gateway pod, no more OOMKills",
        diff: [
          { op: " ", text: "# nginx.conf (rendered)" },
          { op: "-", text: "worker_processes auto;" },
          { op: "+", text: "worker_processes 2;" },
        ],
        yaml: "spec:\n  workerProcesses: 2",
      },
      {
        number: 5557,
        title: "feat: add useClusterIP to NginxProxy",
        url: "https://github.com/nginx/nginx-gateway-fabric/pull/5557",
        merged: "Jul 20, 2026",
        additions: 435,
        deletions: 88,
        problem:
          "Upstreams pointed at individual Pod IPs, so every bit of Pod churn meant a config change and an NGINX reload.",
        change:
          "A top-level useClusterIP option on NginxProxy that routes HTTP/gRPC upstreams through the Service ClusterIP, a stable VIP. Headless and ExternalName Services fall back safely.",
        impact: "NGINX reloads on Pod churn cut to near zero",
        diff: [
          { op: " ", text: "upstream app_80 {" },
          { op: "-", text: "  server 10.0.1.12:8080;" },
          { op: "-", text: "  server 10.0.1.13:8080;" },
          { op: "-", text: "  server 10.0.1.14:8080;" },
          { op: "+", text: "  server 172.20.48.10:80;" },
          { op: " ", text: "}" },
        ],
        yaml: "spec:\n  useClusterIP: true",
      },
    ],
  },

  writing: [
    {
      title: "Innovative Approach to AKS DR Using Azure Pipeline Decorator",
      url: "https://medium.com/engineering-at-bajaj-health/innovative-way-of-aks-dr-using-azure-pipeline-decorator-6fdce2359fe2",
      summary:
        "A disaster-recovery design for Azure Kubernetes Service that improved resilience by 30% and cut failover time by 40%.",
      outlet: "Engineering at Bajaj Health",
    },
    {
      title: "Bridging the Identity Gap: Reverse Sync Azure AD Users to On-Premises AD",
      url: "https://medium.com/engineering-at-bajaj-health/bridging-the-identity-gap-reverse-sync-azure-ad-users-to-on-premises-ad-6a2c9264b3df",
      summary:
        "Keeping identity 100% consistent across cloud and on-prem by syncing Azure AD users back to on-premises AD, with 25% fewer manual errors.",
      outlet: "Engineering at Bajaj Health",
    },
  ],

  changelog: [
    {
      when: "Sep 2025 - now",
      where: "Physicswallah",
      place: "Noida",
      role: "SDE - DevOps",
      current: true,
      notes: [
        "Kong to NGINX Gateway Fabric across 100+ production domains, 50k RPM, zero downtime",
        "Zero-downtime EKS upgrades 1.32 to 1.34 across Dev, Staging and Production",
        "Trivy scanning in CI/CD with Jira-tracked remediation",
        "CDN and Elastic APM 4xx/5xx anomaly alerting, which halved escalations",
        "Private ECR for every EKS environment, enforced with Kyverno",
        "₹4.7L/month saved on orphaned resources; AI workload spend down 30%",
      ],
    },
    {
      when: "Jul 2022 - Sep 2025",
      where: "Bajaj Finserv Health",
      place: "Pune",
      role: "SDE - DevOps",
      current: false,
      notes: [
        "99.99% uptime on Azure, with costs down 15% through better allocation and scaling",
        "200+ containerised apps on AKS; zero-downtime upgrades, 50% faster deploys",
        "Ansible patching in Azure DevOps: 2 days to 1 hour",
        "Azure Firewall + WAF and APIM migration, both with zero downtime",
        "Incident response on Prometheus + Grafana: critical downtime down 20%",
        "100+ Linux systems; zero-downtime MongoDB and Ubuntu upgrades",
      ],
    },
    {
      when: "Before",
      where: "Chitkara University",
      place: "Punjab",
      role: "B.E. Computer Science & Engineering",
      current: false,
      notes: [
        "Graduated with a GPA of 9.9",
        "Toastmasters International: completed the Innovative Planning pathway",
      ],
    },
  ],

  toolkit: [
    { group: "Cloud", items: ["AWS", "Azure", "GCP"] },
    { group: "Orchestration", items: ["Kubernetes", "EKS", "AKS", "Docker", "Kyverno"] },
    { group: "Networking", items: ["Gateway API", "NGINX Gateway Fabric", "Kong", "DNS", "IPSec / VPN Gateway"] },
    { group: "Delivery", items: ["Azure DevOps", "ArgoCD", "Ansible", "Trivy"] },
    { group: "Observability", items: ["Prometheus", "Grafana", "Elastic APM", "ELK", "Filebeat", "Metricbeat"] },
    { group: "Scripting", items: ["Shell", "Node.js", "PowerShell", "Linux"] },
  ],

  recommendations: [
    {
      // Quotes are verbatim; `highlight` must be an exact substring of `quote`.
      highlight: "He doesn't just fix issues, he drives root cause analysis and ensures we prevent repeat problems, a true SRE mindset.",
      quote:
        "Sidharath was a part of our Infra/DevOps team. He consistently impressed me with his ownership mindset, technical depth, and ability to solve problems at scale. He played a key role in strengthening our infrastructure - from implementing automation for patching across 100+ servers, to optimizing MongoDB performance (bringing CPU utilization down from ~98% to single digits), and enabling secure and scalable deployments on Kubernetes. His work directly contributed to improving reliability, efficiency, and uptime of our systems that support millions of requests. What stands out about Sidharath is that he was able to challenge poor technical RCAs from our major cloud providers and hold them accountable. He is an excellent team player and handled incidents with calmness and clarity. He doesn't just fix issues, he drives root cause analysis and ensures we prevent repeat problems, a true SRE mindset.",
      author: "Anurag Vohra",
      role: "Chief Technology Officer, Bajaj Finserv Health",
      date: "Sep 2025",
    },
    {
      highlight: "Great attitude and aptitude.",
      quote:
        "I have known Sidharth since his internship year at BFHL. Great attitude and aptitude. He is able to grasp new technologies and techniques very fast and also very good at troubleshooting problems. He is eager to explore new ideas and also tries to implement them. Great asset to any team he works with!",
      author: "Nitin Jog",
      role: "CIO, Bajaj Finserv Health",
      date: "Sep 2025",
    },
  ],
} as const;

export const sections = [
  { id: "top", label: "home", path: "~" },
  { id: "uptime", label: "ethos", path: "~/ethos" },
  { id: "work", label: "work", path: "~/work" },
  { id: "open-source", label: "open source", path: "~/oss" },
  { id: "writing", label: "writing", path: "~/writing" },
  { id: "changelog", label: "changelog", path: "~/changelog" },
  { id: "toolkit", label: "toolkit", path: "~/toolkit" },
  { id: "words", label: "words", path: "~/words" },
  { id: "contact", label: "contact", path: "~/contact" },
] as const;

export type Profile = typeof profile;
