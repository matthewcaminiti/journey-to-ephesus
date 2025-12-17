<script lang="ts">
  import FileDropzone from '../components/FileDropzone.svelte';
  import { uploadCoin, type CoinMetadata } from '../api';
  
  let selectedFile = $state<File | null>(null);
  let uploading = $state(false);
  let uploadProgress = $state(0);
  let uploadError = $state<string | null>(null);
  let uploadSuccess = $state(false);
  
  let metadata = $state<CoinMetadata>({
    name: '',
    description: '',
    year: null,
    mint: '',
    denomination: '',
    metal: '',
    weight_grams: null,
    diameter_mm: null,
  });
  
  function handleFileSelect(file: File) {
    selectedFile = file;
    uploadError = null;
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!selectedFile || !metadata.name.trim()) {
      uploadError = 'Please provide a model file and coin name';
      return;
    }
    
    uploading = true;
    uploadProgress = 0;
    uploadError = null;
    
    const result = await uploadCoin(
      selectedFile,
      metadata,
      (progress) => { uploadProgress = progress; }
    );
    
    uploading = false;
    
    if (result.success) {
      uploadSuccess = true;
      // Reset form
      selectedFile = null;
      metadata = {
        name: '',
        description: '',
        year: null,
        mint: '',
        denomination: '',
        metal: '',
        weight_grams: null,
        diameter_mm: null,
      };
    } else {
      uploadError = result.error || 'Upload failed';
    }
  }
  
  function resetForm() {
    uploadSuccess = false;
    uploadError = null;
  }
</script>

<div class="min-h-screen pt-28 pb-12">
  <div class="max-w-3xl mx-auto px-4">
    <!-- Header -->
    <div class="mb-10 text-center">
      <div class="flex items-center justify-center gap-3 mb-5">
        <span class="text-[var(--accent-gold)] text-2xl">✦</span>
      </div>
      <h1 class="text-3xl font-semibold text-[var(--text-primary)] mb-3 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
        Add to the Collection
      </h1>
      <p class="text-[var(--text-secondary)] max-w-lg mx-auto transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
        Contribute a new 3D artifact to the archive. Supported formats: GLB, GLTF.
      </p>
    </div>
    
    {#if uploadSuccess}
      <!-- Success State -->
      <div class="panel panel-glow p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-olive)]/10 border-2 border-[var(--accent-olive)]/30
                    flex items-center justify-center transition-colors">
          <span class="text-4xl text-[var(--accent-olive)]">✓</span>
        </div>
        <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-3 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
          Successfully Added
        </h2>
        <p class="text-[var(--text-secondary)] mb-8 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
          Your artifact has been added to the collection.
        </p>
        <div class="flex gap-4 justify-center">
          <a
            href="/"
            class="px-7 py-3 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full
                   border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20 transition-colors"
          >
            View Collection
          </a>
          <button
            onclick={resetForm}
            class="px-7 py-3 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full
                   border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Add Another
          </button>
        </div>
      </div>
    {:else}
      <form onsubmit={handleSubmit} class="space-y-8">
        <!-- File Upload Section -->
        <div class="panel panel-glow p-8">
          <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-5 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
            3D Model File
          </h3>
          <FileDropzone 
            onFileSelect={handleFileSelect} 
            {selectedFile} 
          />
        </div>
        
        <!-- Metadata Section -->
        <div class="panel panel-glow p-8 space-y-6">
          <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2 transition-colors" style="font-family: 'Cormorant Garamond', Georgia, serif;">
            Artifact Details
          </h3>
          
          <!-- Name -->
          <div>
            <label for="coin-name" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
              Name <span class="text-[var(--accent-terracotta)]">*</span>
            </label>
            <input
              id="coin-name"
              type="text"
              bind:value={metadata.name}
              placeholder="e.g., Ephesian Tetradrachm"
              required
              class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                     text-[var(--text-primary)] placeholder-[var(--text-muted)]
                     focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
              style="font-family: 'Crimson Text', Georgia, serif;"
            />
          </div>
          
          <!-- Description -->
          <div>
            <label for="coin-description" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
              Description
            </label>
            <textarea
              id="coin-description"
              bind:value={metadata.description}
              placeholder="Describe the coin's history, significance, and notable features..."
              rows="4"
              class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                     text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none
                     focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
              style="font-family: 'Crimson Text', Georgia, serif;"
            ></textarea>
          </div>
          
          <!-- Grid of smaller fields -->
          <div class="grid grid-cols-2 gap-5">
            <!-- Year -->
            <div>
              <label for="coin-year" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Year <span class="text-[var(--text-muted)] text-xs">(negative for BCE)</span>
              </label>
              <input
                id="coin-year"
                type="number"
                bind:value={metadata.year}
                placeholder="-350"
                class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                       text-[var(--text-primary)] placeholder-[var(--text-muted)]
                       focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;"
              />
            </div>
            
            <!-- Mint -->
            <div>
              <label for="coin-mint" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Mint Location
              </label>
              <input
                id="coin-mint"
                type="text"
                bind:value={metadata.mint}
                placeholder="e.g., Ephesus"
                class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                       text-[var(--text-primary)] placeholder-[var(--text-muted)]
                       focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;"
              />
            </div>
            
            <!-- Denomination -->
            <div>
              <label for="coin-denomination" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Denomination
              </label>
              <input
                id="coin-denomination"
                type="text"
                bind:value={metadata.denomination}
                placeholder="e.g., Tetradrachm"
                class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                       text-[var(--text-primary)] placeholder-[var(--text-muted)]
                       focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;"
              />
            </div>
            
            <!-- Metal -->
            <div>
              <label for="coin-metal" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Metal
              </label>
              <select
                id="coin-metal"
                bind:value={metadata.metal}
                class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                       text-[var(--text-primary)]
                       focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;"
              >
                <option value="">Select metal...</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Copper">Copper</option>
                <option value="Electrum">Electrum</option>
                <option value="Billon">Billon</option>
              </select>
            </div>
            
            <!-- Weight -->
            <div>
              <label for="coin-weight" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Weight <span class="text-[var(--text-muted)] text-xs">(grams)</span>
              </label>
              <input
                id="coin-weight"
                type="number"
                step="0.01"
                bind:value={metadata.weight_grams}
                placeholder="15.2"
                class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                       text-[var(--text-primary)] placeholder-[var(--text-muted)]
                       focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;"
              />
            </div>
            
            <!-- Diameter -->
            <div>
              <label for="coin-diameter" class="block text-sm text-[var(--text-secondary)] mb-2 transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Diameter <span class="text-[var(--text-muted)] text-xs">(mm)</span>
              </label>
              <input
                id="coin-diameter"
                type="number"
                step="0.1"
                bind:value={metadata.diameter_mm}
                placeholder="25"
                class="w-full px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg
                       text-[var(--text-primary)] placeholder-[var(--text-muted)]
                       focus:outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-colors"
                style="font-family: 'Crimson Text', Georgia, serif;"
              />
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        {#if uploadError}
          <div class="panel border-[var(--accent-terracotta)]/30 bg-[var(--accent-terracotta)]/5 p-5 rounded-lg">
            <div class="flex items-center gap-4">
              <span class="text-[var(--accent-terracotta)] text-xl">⚠</span>
              <span class="text-[var(--accent-burgundy)]" style="font-family: 'Crimson Text', Georgia, serif;">{uploadError}</span>
            </div>
          </div>
        {/if}
        
        <!-- Upload Progress -->
        {#if uploading}
          <div class="panel p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-[var(--text-secondary)] transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
                Adding to collection...
              </span>
              <span class="text-sm text-[var(--accent-gold)] font-semibold">{Math.round(uploadProgress)}%</span>
            </div>
            <div class="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden transition-colors">
              <div 
                class="h-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] transition-all duration-300"
                style="width: {uploadProgress}%"
              ></div>
            </div>
          </div>
        {/if}
        
        <!-- Submit Button -->
        <button
          type="submit"
          disabled={uploading || !selectedFile || !metadata.name.trim()}
          class="w-full py-4 text-lg font-semibold rounded-full transition-all duration-200
                 {uploading || !selectedFile || !metadata.name.trim()
                   ? 'bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border-primary)] cursor-not-allowed'
                   : 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]/50'}"
          style="font-family: 'Cormorant Garamond', Georgia, serif;"
        >
          {uploading ? 'Adding...' : '✦ Add to Collection'}
        </button>
      </form>
    {/if}
  </div>
</div>
