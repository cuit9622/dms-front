import { Turnstile } from '@marsidev/react-turnstile'

export default function CFTurnstile({
  value,
  onChange,
}: {
  value?: string
  onChange?: (valuse: string) => void
}) {
  return (
    <Turnstile
      siteKey="0x4AAAAAAAGHnUip06msiFzc"
      options={{ size: 'normal', theme: 'light' }}
      onSuccess={(token) => {
        onChange?.(token)
      }}
    />
  )
}
