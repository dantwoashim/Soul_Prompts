import { json } from '@sveltejs/kit';
import { uploadDashboardAsset } from '$lib/server/storage/assets';

export async function POST({ request }) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return json({ error: 'Missing file upload.' }, { status: 400 });
  }

  try {
    const result = await uploadDashboardAsset(file);
    return json(result);
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : 'Asset upload failed.'
      },
      { status: 500 }
    );
  }
}
