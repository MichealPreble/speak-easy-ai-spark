
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Template {
  id: string;
  title: string;
  content: string;
}

interface TemplateListProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

const TemplateList = ({ templates, onSelectTemplate }: TemplateListProps) => {
  if (templates.length === 0) return null;

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
                onClick={() => onSelectTemplate(template)}
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

export default TemplateList;
