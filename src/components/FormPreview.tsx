
import { Button } from "@/components/ui/button";
import { School, AlertCircle, FileText, FileWarning, Check, X } from "lucide-react";

type FormFieldType = {
  id: string;
  label: string;
  value: string;
  source?: string;
  conflictValue?: string;
  conflictSource?: string;
  required: boolean;
  category: string;
};

interface FormPreviewProps {
  showForm: boolean;
  formFields: FormFieldType[];
  onSubmit: () => void;
}

export function FormPreview({ showForm, formFields, onSubmit }: FormPreviewProps) {
  const renderFormSection = (category: string) => {
    const categoryFields = formFields.filter(field => field.category === category);
    if (categoryFields.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-base font-medium mb-3">{category}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.conflictValue && (
                  <div className="ml-auto flex items-center text-xs text-red-500">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>信息冲突</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full border px-3 py-2 rounded-md text-sm ${
                      field.conflictValue ? "border-red-300 bg-red-50" : "border-input"
                    }`}
                    defaultValue={field.value}
                  />
                  {field.source && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>来源: {field.source}</span>
                    </div>
                  )}
                </div>
                {field.conflictValue && (
                  <div className="bg-muted p-2 rounded-md text-sm border border-border">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <FileWarning className="h-3 w-3 mr-1" />
                        <span>冲突值 (来源: {field.conflictSource})</span>
                      </div>
                      <div className="flex space-x-1">
                        <button className="text-xs bg-green-500 text-white p-1 rounded-sm flex items-center">
                          <Check className="h-3 w-3 mr-0.5" />
                          <span>使用</span>
                        </button>
                        <button className="text-xs bg-muted-foreground text-white p-1 rounded-sm flex items-center">
                          <X className="h-3 w-3 mr-0.5" />
                          <span>忽略</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">{field.conflictValue}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      {!showForm ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center p-4">
            <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
            <h3 className="font-medium">申请表格预览</h3>
            <p className="text-sm mt-1">上传申请材料后，AI将在此处生成申请表格</p>
          </div>
        </div>
      ) : (
        <div className="h-full relative">
          <div className="h-full overflow-auto pb-20">
            <div className="p-4">
              {/* 表单头部和状态说明 */}
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
              {renderFormSection("个人信息")}
              {renderFormSection("教育背景")}
              {renderFormSection("语言能力")}
              {renderFormSection("申请信息")}
              {renderFormSection("推荐信息")}
            </div>
          </div>
          <div className="sticky bottom-6 right-6 float-right mr-6 z-50">
            <Button
              className="bg-app-blue hover:bg-app-blue-dark min-w-[140px] shadow-lg"
              onClick={onSubmit}
            >
              确认并提交申请
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
