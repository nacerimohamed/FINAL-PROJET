const RegionMap = ({ data }) => {
  return (
    <div>
      {data.map((city, index) => (
        <div key={index}>
          {city.ville} - {city.total}
        </div>
      ))}
    </div>
  );
};