<?php

namespace App\Http\Controllers\API;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\API\Controller;
use App\Http\Requests\UpdateAvatarRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AvatarController extends Controller
{
    /**
     * Update authenticated user's avatar.
     */
    public function update(UpdateAvatarRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $file = $request->file('avatar');

            // Unique filename: {timestamp}_{random}.{ext}
            $ext = $file->getClientOriginalExtension();
            $filename = now()->format('YmdHis') . '_' . Str::random(8) . '.' . $ext;
            
            // Store on the 'public' disk under avatars/{userId}/ folder
            $path = $file->storeAs('avatars', $user->id . '/' . $filename, 'public');

            // Delete previous avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Assign and save (use attribute assignment to avoid fillable issues)
            $user->avatar = $path;
            $user->save();

            return ResponseHelper::successResponse(
                [
                    'avatar_url' => Storage::disk('public')->url($path),
                    'avatar_path' => $path,
                ],
                'Avatar updated.'
            );

        } catch (\Exception $e) {
            
            return ResponseHelper::logAndErrorResponse($e, 'Avatar update error', 'Failed to update avatar.');
        }
    }
}
