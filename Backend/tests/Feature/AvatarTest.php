<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AvatarTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure API responses in tests return JSON instead of redirects
        $this->withHeaders(['Accept' => 'application/json']);

        // Clear any existing storage state
        Storage::fake('public');
    }

    protected function tearDown(): void
    {
        // Clean up storage state after each test
        Storage::disk('public')->deleteDirectory('avatars');
        parent::tearDown();
    }

    public function test_update_avatar_success(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $file = UploadedFile::fake()->image('avatar.jpg');

        // Authenticate and perform a multipart PUT (not JSON)
        $response = $this
        ->actingAs($user)
        ->put('/api/user/avatar', [
            'avatar' => $file,
        ]);

        $response->assertStatus(200);

        $json = $response->json();
        $payload = $json;
        if (isset($json['data']) && is_array($json['data'])) {
            $payload = $json['data'];
        }

        $this->assertArrayHasKey('avatar_path', $payload);
        $avatarPath = $payload['avatar_path'];

        Storage::disk('public')->assertExists($avatarPath);

        $user->refresh();
        $this->assertEquals($avatarPath, $user->avatar);
    }

    public function test_unauthorized_user_cannot_upload_avatar(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg');

        // No actingAs -> should be unauthorized for protected API routes
        $response = $this
        ->put('/api/user/avatar', [
            'avatar' => $file,
        ]);

        $response->assertStatus(401);
    }

    public function test_validation_fails_for_missing_file(): void
    {
        $user = User::factory()->create();

        // Missing 'avatar' should trigger validation error (422)
        $response = $this
        ->actingAs($user)
        ->put('/api/user/avatar', [
            //
        ]);

        $response->assertStatus(422);
    }

    public function test_validation_fails_for_invalid_file_type(): void
    {
        $user = User::factory()->create();

        // Non-image file should fail validation
        $notImage = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this
        ->actingAs($user)
        ->put('/api/user/avatar', [
            'avatar' => $notImage,
        ]);

        $response->assertStatus(422);
    }

    public function test_previous_avatar_deleted_on_update_via_endpoint(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        // Generate an old avatar file in storage and set it on the user
        $file = UploadedFile::fake()->image('old_avatar.jpg');

        $response = $this
        ->actingAs($user)
        ->put('/api/user/avatar', [
            'avatar' => $file,
        ]);

        // Set up old avatar
        $oldPath = 'avatars/' . $user->id . '/old_avatar.jpg';
        Storage::disk('public')->put($oldPath, 'old-content');
        $user->avatar = $oldPath;
        $user->save();

        Storage::disk('public')->assertExists($oldPath);

        // Upload a new avatar via the endpoint
        $newFile = UploadedFile::fake()->image('new_avatar.png');

        $response = $this
        ->actingAs($user)
        ->withHeaders(['Accept' => 'application/json'])
        ->put('/api/user/avatar', [
            'avatar' => $newFile,
        ]);

        $response->assertStatus(200);

        // Verify old avatar is deleted and new one exists
        $json = $response->json();
        $payload = $json;
        if (isset($json['data']) && is_array($json['data'])) {
            $payload = $json['data'];
        }

        $this->assertArrayHasKey('avatar_path', $payload);
        $newPath = $payload['avatar_path'];

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($newPath);

        $user->refresh();
        $this->assertEquals($newPath, $user->avatar);
    }
}