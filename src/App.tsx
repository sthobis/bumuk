import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CurrencyInput from "./components/CurrencyInput";

type ResultRow = {
  year: number;
  balance: number;
};

function App() {
  const [start, setStart] = useState(new Date().getFullYear());
  const [end, setEnd] = useState(Math.max(2042, new Date().getFullYear() + 10));
  const [initialBalance, setInitialBalance] = useState(0);
  const [monthlyDeposit, setMonthlyDeposit] = useState(10000000);
  const [yearlyInterest, setYearlyInterest] = useState(6.15);

  const [result, setResult] = useState<Array<ResultRow>>([]);
  const simulate = () => {
    const newResult: Array<ResultRow> = [];
    for (let i = 0; i < end - start; i++) {
      const prevBalance = i === 0 ? initialBalance : newResult[i - 1].balance;
      const monthlyInterest = yearlyInterest / 12;
      const balance = calculateCompoundInterest(
        prevBalance,
        monthlyInterest / 100,
        12,
        monthlyDeposit
      );
      newResult.push({
        year: start + i + 1,
        balance,
      });
    }
    setResult(newResult);
  };

  const balanceWithNoInterest =
    initialBalance + 12 * (end - start) * monthlyDeposit;

  return (
    <div className="flex flex-col items-center">
      <Card className="max-w-sm m-4">
        <CardHeader>
          <CardTitle>Kapan pensiun?</CardTitle>
          <CardDescription>
            Kalkulator bunga majemuk aka compound interest
            <span className="block text-xs mt-1">
              **Dibuat dengan pengetahuan terbatas, bisa jadi salah 🙏
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="year-start">Tahun mulai</Label>
                <Input
                  id="year-start"
                  type="number"
                  min={2000}
                  value={start}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStart(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="year-end">Tahun akhir</Label>
                <Input
                  id="year-end"
                  type="number"
                  min={2000}
                  value={end}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEnd(parseInt(e.target.value));
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value);
                    if (value < start) {
                      setEnd(start + 1);
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="balance">Saldo awal</Label>
                <CurrencyInput
                  id="balance"
                  value={initialBalance}
                  onChange={(value) => setInitialBalance(value || 0)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deposit">Deposit per bulan</Label>
                <CurrencyInput
                  id="deposit"
                  value={monthlyDeposit}
                  onChange={(value) => setMonthlyDeposit(value || 0)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="interest">
                  Imbal hasil{" "}
                  <span className="text-xs text-muted-foreground ml-1">%</span>
                </Label>
                <Input
                  id="interest"
                  type="number"
                  min={0}
                  value={yearlyInterest}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setYearlyInterest(parseFloat(e.target.value));
                  }}
                />
              </div>
            </div>
            <Button className="mt-2" onClick={simulate}>
              Hitung simulasi
            </Button>
          </div>
          {result.length > 0 && (
            <>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead className="text-right">Saldo Akhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell>{row.year}</TableCell>
                      <TableCell className="text-right">
                        {formatToRupiah(row.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mb-4">
                <span className="text-xs text-muted-foreground italic">
                  {"saldo tanpa imbal hasil = "}
                  {formatToRupiah(balanceWithNoInterest)}
                </span>
                <span className="text-xs font-semibold text-green-600 ml-1">
                  {"(+" +
                    percentageIncrease(
                      balanceWithNoInterest,
                      result[result.length - 1].balance
                    ) +
                    "%)"}
                </span>
              </div>
              <div>
                <p className="text-sm">
                  Berdasarkan <i className="font-semibold">4% rule</i>, kamu
                  bisa pensiun pada tahun {end} dengan allowance bulanan sebesar{" "}
                  <span className="border-b border-dashed border-[rgba(255,255,255,0.3)]">
                    {formatToRupiah(
                      (result[result.length - 1].balance * 0.04) / 12
                    )}
                  </span>{" "}
                  atau setara dengan{" "}
                  <span className="border-b border-dashed border-[rgba(255,255,255,0.3)]">
                    {formatToRupiah(result[result.length - 1].balance * 0.04)}
                  </span>{" "}
                  per tahun.
                </p>
              </div>
              <Button
                className="my-4 w-full"
                onClick={() => setResult([])}
                variant="secondary"
              >
                Tutup
              </Button>
              <div className="text-sm mt-4">
                <h3 className="font-bold mb-1">Yearly Increase Formula</h3>
                <div>
                  <code className="block mb-2 text-xs">
                    A = P * (1 + r)^12 + D * ((1 + r)^12 - 1) / r
                  </code>
                  Where:
                  <table>
                    <tbody>
                      <tr>
                        <td>A</td>
                        <td>= Final amount</td>
                      </tr>
                      <tr>
                        <td>P</td>
                        <td>= Initial principal balance</td>
                      </tr>
                      <tr>
                        <td className="align-baseline">r</td>
                        <td>= Interest rate per month (6%/yr = 0.005)</td>
                      </tr>
                      <tr>
                        <td>D</td>
                        <td>= Regular deposit amount</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm">
            <a href="https://github.com/sthobis/bumuk" className="underline">
              github.com/sthobis/bumuk
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;

function calculateCompoundInterest(
  P: number, // Initial principal balance
  r: number, // Interest rate per period
  n: number, // Number of periods
  D: number // Regular deposit amount
): number {
  return P * Math.pow(1 + r, n) + (D * (Math.pow(1 + r, n) - 1)) / r;
}

function formatToRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function percentageIncrease(a: number, b: number) {
  if (a === 0) {
    if (b !== 0) {
      return Infinity;
    }
    return 0;
  }

  const increase = ((b - a) / Math.abs(a)) * 100;

  return Math.round(increase * 100) / 100;
}
