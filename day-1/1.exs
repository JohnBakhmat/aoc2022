File.read!("./input.txt")
|> String.split("\n\n")
|> Enum.map(fn(elf)->
  elf |> String.split("\n")
  |> Enum.map(fn(j)-> String.to_integer(j) end)
  |> Enum.reduce(fn(x, acc) -> x + acc end)
end)
|> Enum.sort(&( &1 > &2 ))
|> Enum.at(0)
|> IO.inspect
