import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react-native"

import { Button } from "@/components/ui/button"

const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    setCopied(true)
    await Clipboard.setStringAsync(text)
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied])

  return (
    <Button variant="ghost" size="icon" onPress={handleCopy}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  )
}

export default CopyToClipboard
