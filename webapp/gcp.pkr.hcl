packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "gcp_project_id" {
  default = "csye6225-414123"
}

source "googlecompute" "my_image" {
  project_id          = var.gcp_project_id
  source_image_family = "centos-stream-8"
  image_name          = "custom-machine-image-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  image_family        = "custom-family"
  machine_type        = "e2-medium"
  zone                = "us-east1-b"
  ssh_username        = "packer"
  image_description   = "Machine Image with Node.js and MySQL on CentOS Stream 8"
  use_internal_ip     = false
  network             = "default"
}

build {
  sources = ["source.googlecompute.my_image"]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./scripts/systemd.service"
    destination = "/tmp/systemd.service"
  }

  provisioner "file" {
    source      = "./scripts/config.yaml"
    destination = "/tmp/config.yaml"
  }

  provisioner "shell" {
    script = "./scripts/mi_setup.sh"
  }

  post-processor "manifest" {
    output     = "packer-manifest.json"
    strip_path = true
  }

}

