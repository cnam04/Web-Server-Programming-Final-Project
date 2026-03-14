import { toast } from 'bulma-toast'

export function showToast(message: string, type = 'is-info') {
  toast({
    message,
    duration: 2500,
    position: 'top-right',
    dismissible: true,
    extraClasses: 'big-success-toast',
  })
}
