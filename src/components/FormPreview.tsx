
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, FileText, AlertCircle } from "lucide-react";
import { FormFieldType } from "@/types/chat";

interface FormPreviewProps {
  fields: FormFieldType[];
  onSubmit: () => void;
  onFieldChange: (fieldId: string, value: string) => void;
}

function renderFormSection(
  category: string,
  fields: FormFieldType[],
  onFieldChange: (fieldId: string, value: string) => void
) {
  const categoryFields = fields.filter((field) => field.category === category);

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center">
              <label
                className={`text-sm font-medium ${
                  field.required
                    ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                    : ""
                }`}
              >
                {field.label}
              </label>
              {field.conflictValue && (
                <div className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full">
                  冲突
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                className={`w-full border px-3 py-2 text-sm rounded-md ${
                  field.conflictValue
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-input"
                }`}
                value={field.value}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
              />

              {field.source && (
                <div className="absolute right-3 top-2.5">
                  <div className="relative group">
                    <FileText className="h-4 w-4 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                      <p className="font-medium mb-1">数据来源:</p>
                      <p>{field.source}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {field.conflictValue && (
              <div className="flex items-center text-xs text-red-600 mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>
                  冲突值: {field.conflictValue} (来源: {field.conflictSource})
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormPreview({ fields, onSubmit, onFieldChange }: FormPreviewProps) {
  return (
    <Card className="flex flex-col h-full border animate-fade-in">
      <div className="p-4 border-b bg-card">
        <h2 className="text-lg font-medium flex items-center">
          <School className="mr-2 h-5 w-5 text-app-blue" />
          申请表格预览
        </h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">哈佛大学 - 计算机科学申请表</h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>已填充</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>冲突</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                <span>警告</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {renderFormSection("个人信息", fields, onFieldChange)}
            {renderFormSection("教育背景", fields, onFieldChange)}
            {renderFormSection("语言能力", fields, onFieldChange)}
            {renderFormSection("申请信息", fields, onFieldChange)}
            {renderFormSection("推荐信息", fields, onFieldChange)}

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                <span className="text-red-500">*</span> 表示必填字段
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">保存为草稿</Button>
                <Button
                  className="bg-app-blue hover:bg-app-blue-dark"
                  onClick={onSubmit}
                >
                  确认并提交申请
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
