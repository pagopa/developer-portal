resource "aws_ses_domain_identity" "devportal" {
  domain = var.dns_domain_name
}

resource "aws_ses_domain_dkim" "devportal" {
  domain = aws_ses_domain_identity.devportal.domain
}

resource "aws_ses_email_identity" "noreply_email" {
  email = format("no-reply@%s", var.dns_domain_name)
}
