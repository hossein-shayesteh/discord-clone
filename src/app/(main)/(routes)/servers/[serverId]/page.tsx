const ServerIdPage = ({
  params: { serverId },
}: {
  params: { serverId: string };
}) => {
  return <div>server ID: {serverId} </div>;
};
export default ServerIdPage;
