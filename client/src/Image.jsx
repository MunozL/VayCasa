export default function Image({ src, ...rest }) {
  src = src && src.includes("https://") ? src : "http://localhost:4000/" + src;
  return <img {...rest} src={src} alt={""} />;
}
//iif path includes https use link otherwise add localhost:4000
