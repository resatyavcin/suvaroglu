import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {AlertCircleIcon} from "lucide-react";

interface CustomerAlertDialogProps {
    isOpen: boolean
    title: string
    description: string
    okText: string
    cancelText: string
    onApprove: ()=>void,
    onCancel:()=>void
}

export function CustomerAlertDialog({title, description, okText, cancelText, onApprove, onCancel, isOpen}: CustomerAlertDialogProps) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader className="flex items-center justify-between">
                    <AlertCircleIcon className={"text-yellow-600"}/>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onApprove}>{okText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
