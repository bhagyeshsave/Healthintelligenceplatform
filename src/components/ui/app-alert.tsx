import * as React from "react";
import { CheckCircle, AlertTriangle, Info, X, Bell } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "./alert-dialog";

type AlertType = "success" | "warning" | "info" | "emergency";

interface AppAlertProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  actionLabel?: string;
}

const alertConfig: Record<AlertType, { icon: React.ElementType; gradient: string; iconColor: string; buttonGradient: string }> = {
  success: {
    icon: CheckCircle,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
    buttonGradient: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
    buttonGradient: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
  },
  info: {
    icon: Info,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
    buttonGradient: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500",
  },
  emergency: {
    icon: Bell,
    gradient: "from-red-500/20 via-pink-500/10 to-transparent",
    iconColor: "text-red-400",
    buttonGradient: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500",
  },
};

export function AppAlert({
  open,
  onClose,
  title,
  message,
  type = "info",
  actionLabel = "OK",
}: AppAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="bg-slate-900 border-slate-700/50 text-white max-w-md overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <AlertDialogHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-white">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-300 text-sm whitespace-pre-line leading-relaxed pl-0">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="relative z-10 mt-4">
          <AlertDialogAction
            onClick={onClose}
            className={`${config.buttonGradient} text-white border-0 px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all duration-200`}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface UseAppAlertReturn {
  showAlert: (options: Omit<AppAlertProps, "open" | "onClose">) => void;
  AlertComponent: React.FC;
}

export function useAppAlert(): UseAppAlertReturn {
  const [alertState, setAlertState] = React.useState<Omit<AppAlertProps, "open" | "onClose"> | null>(null);

  const showAlert = React.useCallback((options: Omit<AppAlertProps, "open" | "onClose">) => {
    setAlertState(options);
  }, []);

  const handleClose = React.useCallback(() => {
    setAlertState(null);
  }, []);

  const AlertComponent: React.FC = React.useCallback(() => {
    if (!alertState) return null;
    return (
      <AppAlert
        open={true}
        onClose={handleClose}
        {...alertState}
      />
    );
  }, [alertState, handleClose]);

  return { showAlert, AlertComponent };
}
