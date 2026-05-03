import { getOwnedByWallet, getRentedByWallet } from "@/lib/marketplace";
import { toListingDTO } from "@/lib/listing-serde";

function isAddress(a: string): a is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(a);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  if (!isAddress(address)) {
    return Response.json({ error: "invalid address" }, { status: 400 });
  }

  const [owned, rented] = await Promise.all([
    getOwnedByWallet(address),
    getRentedByWallet(address),
  ]);

  return Response.json({
    owned: owned.map((l) => toListingDTO(l, false)),
    rented: rented.map((l) => ({
      ...toListingDTO(l, false),
      rentalExpiry: l.rentalExpiry,
    })),
  });
}
