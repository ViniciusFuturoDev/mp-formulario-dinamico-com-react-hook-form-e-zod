export const FormErros = (props: { message: string }) => {
  return (
    <div className="min-h-4">
      <p className="text-xs text-red-400 mt-1">{props.message}</p>
    </div>
  );
};
