
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Template {
  id: string;
  title: string;
  content: string;
}

interface TemplateSectionProps {
  templates: Template[];
  occasionName: string;
}

const TemplateSection: React.FC<TemplateSectionProps> = ({ templates, occasionName }) => {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  if (templates.length === 0) return null;

  const handleSelectTemplate = (template: Template) => {
    trackEvent('select_template', 'SpeechPractice', `${occasionName}:${template.title}`);
    navigate('/chat', { state: { occasion: { name: occasionName }, template: template.content } });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Suggested Templates</h3>
      <div className="space-y-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-md">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{template.content.substring(0, 100)}...</p>
              <Button
                variant="link"
                onClick={() => handleSelectTemplate(template)}
                aria-label={`Select template: ${template.title}`}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSection;
