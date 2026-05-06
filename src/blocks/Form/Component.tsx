'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { DefaultDocumentIDType } from 'payload'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RichText } from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: DefaultDocumentIDType
  }
> = (props) => {
  const { enableIntro, form: formRaw, introContent } = props

  const formFromProps =
    formRaw &&
      typeof formRaw === 'object' &&
      'fields' in formRaw &&
      Array.isArray(formRaw.fields)
      ? (formRaw as FormType)
      : null

  if (!formFromProps) {
    return null
  }

  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
  } = formFromProps

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields ?? []),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()

  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const redirectUrl = redirect.url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="w-full">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}

      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <div className="border border-border bg-muted/60 p-6 text-foreground">
            <RichText data={confirmationMessage} />
          </div>
        )}

        {isLoading && !hasSubmitted && (
          <p className="text-sm text-muted-foreground">Loading, please wait...</p>
        )}

        {error && (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {`${error.status || '500'}: ${error.message || ''}`}
          </div>
        )}

        {!hasSubmitted && (
          <form id={String(formID)} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
              {formFromProps?.fields?.map((field, index) => {
                const Field: React.FC<any> | undefined =
                  fields?.[field.blockType as keyof typeof fields]

                if (!Field) return null

                const isFullWidth =
                  field.blockType === 'textarea' ||
                  field.blockType === 'select'               

                return (
                  <div
                    key={index}
                    className={isFullWidth ? 'md:col-span-2' : 'md:col-span-1'}
                  >
                    <Field
                      form={formFromProps}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                    />
                  </div>
                )
              })}
            </div>

            <button
              form={String(formID)}
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full rounded-none border border-[#c8a24d] bg-[#c8a24d] px-5 py-6 text-center text-[11px] font-extrabold uppercase tracking-[0.28em] text-black transition-all duration-300 ease-out hover:bg-transparent hover:text-[#c8a24d] hover:scale-[1.03] active:scale-[0.97]"
            >
              {isLoading ? 'Sending...' : submitButtonLabel || 'Dispatch Message'}
            </button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}