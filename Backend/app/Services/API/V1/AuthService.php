<?php

namespace App\Services\API\V1;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class AuthService
{
    public function isVerified(User $user): bool
    {
        return $user->email_verified_at ? true : false;
    }

    public function hashDevice($userId, string $userAgent): string
    {
        return hash('sha256', "$userId|$userAgent");
    }

    public function addDevice(User $user, string $deviceHash, int $maxDevices): void
    {
        $devices = $user->known_devices ?? collect();

        $devices = $devices->push([
                        "hash" => $deviceHash,
                        "last_used_at" => now(),
                    ]);

        $user->known_devices = $devices->sortByDesc('last_used_at')->take($maxDevices)->values();
        $user->save();
    }

    public function updateLastTimeDeviceUsed(User $user, string $deviceHash): void
    {
        $devices = $user->known_devices ?? null;

        if (!$devices) {
            throw new UnprocessableEntityHttpException('No known devices found.');
        }

        $devices = $devices->map(function ($device) use ($deviceHash) {
            if ($device['hash'] === $deviceHash) {
                $device['last_used_at'] = now();
            }
            return $device;
        });

        $user->known_devices = $devices->sortByDesc('last_used_at')->values()->all();
        $user->save();
    }

    public function makePasswordResetToken(User $user): string
    {
        return Password::broker()->createToken($user);
    }

    public function validatePasswordResetToken(string $email, string $token): bool
    {
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if ($record &&
            Hash::check($token, $record->token) &&
            !Carbon::parse($record->created_at)->addMinutes(config('auth.passwords.users.expire'))->isPast()){
            return true;

        } else {
            return false;
        }
    }

    public function updatePassword(array $credentials): void
    {
        Password::broker()->reset($credentials, function ($user, $password) {
            $user->forceFill([
                'password' => $password
            ])->save();
        });
    }

    public function unsetKnownDevices(User $user): void
    {
        $user->known_devices = null;
        $user->save();
    }
}
