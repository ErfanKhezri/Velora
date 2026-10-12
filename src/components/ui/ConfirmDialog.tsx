import { Button } from "./Button";
import { Modal } from "./Modal";

type Props = {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({ open, title, text, confirmLabel, loading, onConfirm, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <p className="leading-8 text-muted">{text}</p>
    </Modal>
  );
}
