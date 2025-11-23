export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const userMessage = body.message;

  // 1. Define your Resume Context
  const resumeData = `
  NAME: Gorkem Bayar
  ROLE: Senior Data Analyst | Performance Management Specialist
  CONTACT: bayargorkem@outlook.com | Toronto, ON
  LINKEDIN: linkedin.com/in/gorkemb
  PORTFOLIO: https://gorkemb.pages.dev
  
  SUMMARY:
  Results-oriented Data Analyst with 8+ years of experience. Expert in Performance Management Frameworks, KPI dashboards (Power BI, SQL, Python), and Actuarial Science.
  
  SKILLS:
  - BI: Power BI (DAX), Tableau, Looker Studio.
  - Engineering: SQL, Python (Pandas, NumPy), Power Automate, ETL Pipelines.
  - Project Mgmt: Earned Value Management (EVM), SAP (PCM), MS Project.
  - Stats: Regression Modeling, Variance Analysis, Risk Assessment.
  
  EXPERIENCE:
  1. Canada Revenue Agency (Data Analyst, May 2023 - Present):
     - Establish KPIs for HR/IT projects using Power BI.
     - Reduced project delivery times by 20% via SQL/SharePoint analysis.
     - Automated workflows with Power Automate (30% less manual effort).
  
  2. Canada Revenue Agency (Project Officer, Sep 2022 - May 2023):
     - Supported Performance Management Framework (95% compliance).
     - Mitigated project risks by 20%.
  
  3. Turkish Motor Insurers' Bureau (Sr. Systems Analyst, Apr 2021 - Dec 2021):
     - Engineered ETL processes using SQL and Python.
     - Developed predictive models for risk exposure.
  
  4. Istanbul Exporters' Associations (Foreign Trade Specialist, Jun 2015 - Mar 2021):
     - Implemented SAP PCM.
     - Increased strategic participation by 40% using SQL analysis on trade datasets.
  
  EDUCATION:
  - Graduate Certificate: Business Intelligence System Infrastructure (Algonquin College).
  - Bachelor: Actuarial Sciences (Hacettepe University).
  - Certifications: AWS Cloud Practitioner, MS Azure Fundamentals, Google Analytics.
  
  GITHUB PROJECTS (Summarized):
  - Wildfire Duration Analysis in Canada (https://github.com/LegateG/ds-wildfire): Machine learning project using Python, analyzing factors influencing Canadian wildfire duration to inform operational strategies and resource allocation.
  - Permanent Residency Admissions (https://github.com/LegateG/IRCC-PRA): Interactive Power BI dashboard analyzing Canadian immigration data, featuring an automated data refresh process.
  - Diabetes Analysis (https://github.com/LegateG/EDA_Pima): Machine learning analysis of diabetes risk factors using Python and statistical modeling.

  `;

  // 2. Prepare the System Prompt
  const systemPrompt = `You are an AI assistant for Gorkem Bayar. You are speaking to a recruiter or hiring manager. 
  Your goal is to answer questions about Gorkem's experience, skills, and projects based STRICTLY on the context provided below.
  
  Tone: Professional, concise, and helpful.
  
  Context:
  ${resumeData}
  
  If the answer is not in the context, say: "I don't have the specific details on that within my current database, but Gorkem would be happy to discuss it in an interview."`;

  // 3. Call Cloudflare Workers AI
  // We use the binding 'env.AI' which acts like a local library function
  try {
    const response = await env.AI.run('@cf/google/gemma-2-9b-it', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    return new Response(JSON.stringify({ reply: response.response }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
