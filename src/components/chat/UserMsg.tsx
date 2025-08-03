import TextWithAddresses from "../ui/TextWithAddresses";

const UserMsg = ({ message }: { message: string }) => {
  return (
    <div className="rounded-full p-2 px-4 text-black-60 dark:text-white-90 bg-gray-50 dark:bg-black-80 w-fit max-w-[80%] ml-auto">
      <TextWithAddresses
        text={message}
        addressClassName="!bg-blue-200 dark:!bg-blue-800/50 !text-blue-900 dark:!text-blue-100"
      />
    </div>
  );
};

export default UserMsg;
