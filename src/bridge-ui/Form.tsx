import { features } from "@/lib/config";
import { Form as AntForm, type FormProps as AntFormProps } from "antd";
import * as React from "react";

export interface BridgeFormProps extends AntFormProps {
  useNewUI?: boolean;
}

export function Form(props: BridgeFormProps): React.ReactElement {
  const { useNewUI = features.newUIForms, ...restProps } = props;

  if (useNewUI) {
    // For new UI, we'll use FormField components within a regular form
    return <form {...restProps}>{props.children as React.ReactNode}</form>;
  }

  return <AntForm {...restProps}>{props.children as React.ReactNode}</AntForm>;
}

// Export sub-components for compatibility
export const FormItem = AntForm.Item;
export const FormList = AntForm.List;
export const FormProvider = AntForm.Provider;
export const FormErrorList = AntForm.ErrorList;
