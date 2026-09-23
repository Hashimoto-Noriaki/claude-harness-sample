export default function Home() {
  //わざと型エラーを出すために、string型をnumber型に代入する
  const ciTest: string = "CIをわざと失敗させるためのテスト";
  return <div>{ciTest}</div>;
}
